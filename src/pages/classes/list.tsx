import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ClassDetails, Subject, User } from "@/types";
import { ShowButton } from "@/components/refine-ui/buttons/show";

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");

  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const subjectFilter =
    selectedSubject === "all"
      ? []
      : [{ field: "subject", operator: "eq" as const, value: selectedSubject }];

  const teacherFilter =
    selectedTeacher === "all"
      ? []
      : [{ field: "teacher", operator: "eq" as const, value: selectedTeacher }];

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 100 },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: { pageSize: 100 },
  });

  const subjects = subjectsQuery?.data?.data || [];
  const teachers = teachersQuery?.data?.data || [];

  const classesTable = useTable<ClassDetails>({
    columns: useMemo<ColumnDef<ClassDetails>[]>(
      () => [
        {
          id: "banner",
          accessorKey: "bannerUrl",
          size: 120,
          header: () => <p className="column-title ml-2">Banner</p>,
          cell: ({ getValue }) => (
            <img
              src={getValue<string>()}
              alt="banner"
              className="w-20 h-12 rounded object-cover"
            />
          ),
        },
        {
          id: "name",
          accessorKey: "name",
          size: 250,
          header: () => <p className="column-title">Class Name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
          filterFn: "includesString",
        },
        {
          id: "status",
          accessorKey: "status",
          size: 120,
          header: () => <p className="column-title">Status</p>,
          cell: ({ getValue }) => (
            <Badge
              variant={
                getValue<string>() === "active" ? "default" : "secondary"
              }
            >
              {getValue<string>()}
            </Badge>
          ),
        },
        {
          id: "subject",
          accessorKey: "subject.name",
          size: 200,
          header: () => <p className="column-title">Subject</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
        },
        {
          id: "teacher",
          accessorKey: "teacher.name",
          size: 200,
          header: () => <p className="column-title">Teacher</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
        },
        {
          id: "capacity",
          accessorKey: "capacity",
          size: 120,
          header: () => <p className="column-title">Capacity</p>,
          cell: ({ getValue }) => <span>{getValue<number>()}</span>,
        },
        {
          id: "details",
          size: 140,
          header: () => <p className="column-title">Details</p>,
          cell: ({ row }) => (
            <ShowButton
              resource="classes"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "classes",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...searchFilters, ...subjectFilter, ...teacherFilter],
      },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={classesTable} />
    </ListView>
  );
};

export default ClassesList;
